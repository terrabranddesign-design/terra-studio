export async function onRequest() {
  return new Response('FUNCTION WORKS', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8'
    }
  });
}
