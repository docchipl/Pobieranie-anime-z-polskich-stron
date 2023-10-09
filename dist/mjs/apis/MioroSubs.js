import axios from "axios";
export default async function MioroSubsAPI(action, post, nume, type) {
    try {
        const form = new URLSearchParams();
        form.append("action", action);
        form.append("post", post);
        form.append("nume", nume);
        form.append("type", type);
        const response = await axios.post(`https://miorosubs.pl/wp-admin/admin-ajax.php`, form);
        if (!response.data.embed_url) {
            return {
                status: 500,
            };
        }
        return {
            status: 200,
            player: response.data.embed_url,
        };
    }
    catch (error) {
        return {
            status: 500,
        };
    }
}
