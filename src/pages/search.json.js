import { getCollection } from "astro:content";

async function getPosts() {
    const posts = (await getCollection('blog'));
        //.filter(post => !post.data.draft)
        //.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    //);
    return posts.map(post => (
        {
            id : post.id,
            title: post.data.title,
            description : post.data.description,
            body : post.body
        }
    ));
}

export async function GET({}) { // https://docs.astro.build/en/guides/on-demand-rendering/#enabling-on-demand-rendering
    return new Response(
        JSON.stringify(await getPosts()),
        {
            status : 200,
            "Content-type" : "application/json",
        }
    );
}