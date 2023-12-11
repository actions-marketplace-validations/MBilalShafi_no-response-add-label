import * as core from '@actions/core'
import * as github from '@actions/github'
import Config from './config'
import NoResponse from './no-response'

async function run(): Promise<void> {
  try {
    const eventName = process.env['GITHUB_EVENT_NAME']

    const config = new Config()
    const noResponse = new NoResponse(config)

    if (eventName === 'schedule') {
      noResponse.sweep()
    } else if (eventName === 'issue_comment') {
      noResponse.unmark()
    } else if (eventName === 'issues') {
      const payload = JSON.stringify(github.context.payload, undefined, 2)
      console.log(`The event payload: ${payload}`)
      noResponse.removeLabels()
    } else {
      core.error(`Unrecognized event: ${eventName} test`)
    }
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
