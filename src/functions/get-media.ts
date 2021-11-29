// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {Readable} from 'stream'

type Event = {
  key: string
}

type S3Context = {
  AWS_ACCESS_KEY_ID: string,
  AWS_SECRET_ACCESS_KEY: string,
  REGION: string,
  BUCKET: string
}

export const handler: ServerlessFunctionSignature<S3Context, Event> = async function (
  context: Context<S3Context>,
  event: Event,
  callback: ServerlessCallback,
) {

  console.log(event.key)

  const s3Client = new S3Client({region: context.REGION})

  let response = await s3Client.send(new GetObjectCommand({Bucket: context.BUCKET, Key: event.key}))

  const buffer = await streamToBuffer(response.Body!!)
  console.log(buffer)
  const size = response.ContentLength
  console.log(size)

  const twilioResponse = new Twilio.Response()
  twilioResponse.setBody(buffer)
  twilioResponse.appendHeader('Content-Type', 'image/png')
  twilioResponse.appendHeader('Content-Length', `${size}`)
  callback(null, twilioResponse)
}

const streamToBuffer = (stream: Readable | ReadableStream | Blob): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    // @ts-ignore
    const chunks = []
    // @ts-ignore
    stream.on('data', (chunk) => chunks.push(chunk))
    // @ts-ignore
    stream.on('error', reject)
    // @ts-ignore
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })