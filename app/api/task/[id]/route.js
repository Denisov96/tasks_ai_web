export function GET (request,object) {
 return new Response(`Hello ${object.params.id}`)
}

