// Test the connection to the database
import { supabase } from './db';

const testConnection = async () => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Users fetched successfully:', data);
    }
};

testConnection();
