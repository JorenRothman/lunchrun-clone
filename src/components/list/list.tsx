'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import type {
    RealtimeChannel,
    RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

type Item = {
    id: number;
    name: string;
};

type Props = {
    serverItems: Item[];
};

export default function List({ serverItems }: Props) {
    const { toast } = useToast();
    const [items, setItems] = useState<Item[]>(serverItems);

    const supabase = createClient();

    useEffect(() => {
        const channel: RealtimeChannel = supabase
            .channel('realtime:items')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'items',
                },
                (payload: RealtimePostgresChangesPayload<Item>) => {
                    console.log(payload);

                    if (
                        payload.eventType === 'INSERT' ||
                        payload.eventType === 'UPDATE'
                    ) {
                        setItems([...items, payload.new]);
                    }

                    if (payload.eventType === 'DELETE') {
                        setItems(
                            items.filter((item) => item.id !== payload.old.id),
                        );
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, items, setItems]);

    async function remove(id: number) {
        const { error } = await supabase.from('items').delete().eq('id', id);

        if (error) {
            return toast({
                title: 'Error',
                description: 'Failed to remove item',
            });
        }

        toast({
            title: 'Success',
            description: 'Item removed',
        });
    }

    return (
        <div>
            <h2 className="mb-4 text-2xl font-medium">Items</h2>
            <ul className="w-full">
                {items.map((item) => (
                    <li
                        className="mt-[-2px] flex w-full items-center border-b-2 border-t-2 border-white py-2"
                        key={item.id}
                    >
                        {item.name}
                        <Button
                            className="ml-auto border-white"
                            variant="outline"
                            onClick={() => remove(item.id)}
                        >
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
