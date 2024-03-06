import Add from '@/components/list/add';
import List from '@/components/list/list';
import { createClient } from '@/utils/supabase/server';

export default async function Index() {
    const supabase = createClient();

    const { data: items } = await supabase.from('items').select();

    return (
        <div className="container flex min-h-dvh flex-col">
            <div className="my-12">
                {items ? <List serverItems={items} /> : <p>No items</p>}
            </div>
            <div className="my-12 mt-auto">
                <Add />
            </div>
        </div>
    );
}
