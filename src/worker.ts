import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { Ai } from '@cloudflare/ai'

const app = new Hono()
app.use('*',cors({ origin: '*', allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'] }))

app.get('/', (c) => {
	return c.html(`<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Worker AI Llama2</title>
		<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
		<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
	</head>
	
	<body class="bg-gray-100 text-gray-900">
		<div class="container mx-auto p-4">
			<h1 class="text-3xl font-bold mb-4">Worker AI Llama2</h1>
			<p id="resp" class="mb-4 bg-red-500">

			</p>
			<textarea id="prompt" class="w-full p-2 mb-4 border rounded" rows="5" placeholder="Type something..."></textarea>
			<button id="sendBPrompt" class="bg-blue-500 text-white px-4 py-2 rounded">Send prompt</button>
		</div>
	
		<script>
			document.getElementById('sendBPrompt').addEventListener('click', function () {
				const promptValue = document.getElementById('prompt').value;
				document.getElementById('resp').textContent = 'Sending...';  
				axios.post('/prompt', {
					prompt: promptValue
				})
				.then(function (response) {
					document.getElementById('resp').textContent = response.data.response;
				})
				.catch(function (error) {
					console.error('Error occurred:', error);
				});
			});
		</script>
	</body>
	
	</html>
`);
})

app.post('/prompt', async (c) => {
	const { prompt }  = await c.req.json();
	if(prompt){
		const ai = new Ai(c.env.AI);
	
		const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
			prompt 
		  }
		);
	
		return c.json(response);
	}

	return c.text('invalid request', 500)
})

export default app
export interface Env {
  AI: any;
}


