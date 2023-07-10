import axios from "axios";
import FormData from "form-data";

export default function MioroSubs(action, post, nume, type) {
  const form = new FormData();
  form.append("action", action);
  form.append("post", post);
  form.append("nume", nume);
  form.append("type", type);
  const request = axios
    .post(`https://miorosubs.pl/wp-admin/admin-ajax.php`, form)
    .then(function (response) {
      return response.data;
    })
    .catch((err) => {
      return null;
    });

  return request;
}
