'use client';

import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: 'Name must be at least 3 characters',
        })
        .max(100, {
            message: 'Name must be at most 100 characters',
        }),
});

export default function Add() {
    const { toast } = useToast();
    const supabase = createClient();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '' },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { error } = await supabase
            .from('items')
            .insert({ name: values.name });

        if (error) {
            return toast({
                title: 'Error',
                description: 'Failed to add item',
            });
        }

        form.reset();

        toast({
            title: 'Success',
            description: `Added item`,
        });
    };

    return (
        <div>
            <h2 className="mb-4 text-2xl font-medium">Add item</h2>
            <Form {...form}>
                <form
                    className="flex flex-col items-start gap-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <Input {...field} />
                                <FormDescription>
                                    Enter the name of the item
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
