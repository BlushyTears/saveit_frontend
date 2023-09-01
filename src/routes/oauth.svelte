<script>
    import { onMount } from 'svelte';

    // onMount(() => {
    //     // Fetch the code from the URL parameters
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const code = urlParams.get('code');
    //     console.log("Received code:", code);

    //     // Send POST request to backend to exchange the code for an access token
    //     fetch("http://127.0.0.1:8000/api/googleauth/", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ code })
    //     })
    //     .then(res => {
    //     if (!res.ok) {
    //         throw new Error(`Failed to exchange code for access tokennnnn: ${res.status} ${res.statusText}`);
    //     }
    //     return res.json();
    //     })
    //     .then(data => {
    //     // If successful, the access_token will be in the response
    //     if (data.access_token) {
    //         console.log("Received access token:", data);
    //         // Store the token securely and navigate the user to the protected area
    //     }
    //     })
    //     .catch(error => {
    //     console.error("An error occurred:", error);
    //     // Add user-friendly error handling here
    //     });
    // });
</script>



<h1>Logging in</h1>



