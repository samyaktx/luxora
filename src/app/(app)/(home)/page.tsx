import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'categories',
  })
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <div>
          <Button variant="elevated">Its button</Button>
        </div>
        <div>
          <Input placeholder="Its input" />
        </div>
        <div>
          <Progress value={50} />
        </div>
        <div>
          <Textarea placeholder="Its textarea" />
        </div>
        <div>
            <Checkbox />
        </div>
        <div>
          {/* {JSON.stringify(data, null, 2)} */}
          Category name : { }
          {data.docs.map((name) => name.name)}
        </div>
      </div>
    </div>
  );
}
