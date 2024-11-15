import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  async function createPost(formData: FormData): Promise<void> {
    "use server";

    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const post = await db.post.create({
      data: {
        title: title,
        body: body,
      },
    });
    revalidatePath("/");
    // return post;
  }

  const postData = await db.post.findMany();

  async function updatePost(formData: FormData): Promise<void> {
    "use server";

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const post = await db.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        body: body,
      },
    });
    revalidatePath("/");
    // return post;
  }

  async function deletePost(formData: FormData): Promise<void> {
    "use server";

    const id = formData.get("id") as string;

    const post = await db.post.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/");
    // return post;
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>CRUD App</CardTitle>
          <CardDescription>Create your love...</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPost}>
            <label htmlFor="title">Title</label>
            <Input
              type="text"
              name="title"
              className="mb-3"
              placeholder="title"
            />
            <label htmlFor="body">Body</label>
            <Input type="body" name="body" placeholder="body" />
            <Button className="w-full mt-4">Save</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          All Posts
        </h2>
        {postData.map((post) => (
          <div className="mb-8 shadow-lg">
            <Card>
              <form action={updatePost}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.body}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input name="id" defaultValue={post.id} type="hidden" />
                  <label htmlFor="title">Title</label>
                  <Input
                    type="text"
                    name="title"
                    className="mb-3"
                    placeholder="title"
                    defaultValue={post.title}
                  />
                  <label htmlFor="body">Body</label>
                  <Input
                    type="body"
                    name="body"
                    placeholder="body"
                    defaultValue={post.body}
                  />
                </CardContent>
                <CardFooter>
                  <Button className="w-full mt-4">Update</Button>
                </CardFooter>
              </form>
              <CardContent>
                <form action={deletePost}>
                  <Input name="id" defaultValue={post.id} type="hidden" />
                  <Button variant="destructive">Delete</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
