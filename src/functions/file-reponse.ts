import '@twilio-labs/serverless-runtime-types'
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature, TwilioResponse,
} from '@twilio-labs/serverless-runtime-types/types'
import got from 'got'

export const handler: ServerlessFunctionSignature<{}, RequestParameters> = async function (
  context: Context,
  event: RequestParameters,
  callback: ServerlessCallback,
) {
  console.log(event.id)
  const response = await got('https://protected-test-2871.twil.io/zoom.png', {responseType: 'buffer'})
  const buffer = response.body
  console.log(buffer)
  const size = response.body.length
  console.log(response.body.length)
  const twilioResponse = new Twilio.Response()
  twilioResponse.setBody(buffer)
  twilioResponse.appendHeader('Content-Type', 'image/png')
  twilioResponse.appendHeader('Content-Length', `${size}`)
  callback(null, twilioResponse)
}

type RequestParameters = {
  id: string
}