import { Router } from 'itty-router'
import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)
// Create a new router
const router = Router()

router.get("/items", async () => {
  const list = await kv.list()
  console.log(JSON.stringify(list))

  let postPromises = list.keys.map(key => kv.get(key.name))
 
  let getPosts = await Promise.all(postPromises)

  list.keys.forEach((element, index) => {
    getPosts[index] = JSON.parse(getPosts[index])
    getPosts[index].id = element.name
  })

  return new Response(JSON.stringify(getPosts), {
    headers: { 
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*'
    }
  })
})

router.post("/additem", async request => {
  let post = await request.json()

  let id

  if (post.id) {
    id = post.id
    delete post.id
  } else {
    id = nanoid()
  }

  let serializedPost = JSON.stringify(post)
  await kv.put(id, serializedPost)
  post.id = id
  return new Response(JSON.stringify(post), {
    headers: {
      'access-control-allow-origin': '*'
    }
  })
})

router.delete("/deleteitem", async request => {
  let post = await request.json()

  await kv.delete(post.id)
  return new Response('success', {
    headers: {
      'access-control-allow-origin': '*'
    }
  })
})


router.options("/additem", () => new Response('Success', {
  headers: { 
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*'
  }
}))

router.options("/deleteitem", () => new Response('Success', {
  headers: { 
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'DELETE'
  }
}))

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
