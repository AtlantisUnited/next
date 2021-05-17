/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react'
import { AuthProvider }     from '@atlantis-lab/react-auth'

type Props = {
  token?: string
}

export const withAuth = () => WrapperComponent =>
  class WithAuth extends Component<Props> {
    static async getInitialProps(context) {
      let props = {}

      const {
        ctx: { req },
      } = context

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(context)
      }

      let token = null

      if (req && req.get('authorization')) {
        token = req.get('authorization')
      } else if ((process as any).browser) {
        token = (window as any).__NEXT_DATA__.props.token // eslint-disable-line prefer-destructuring
      }

      return {
        ...props,
        token,
      }
    }

    render() {
      const { token } = this.props

      return (
        <AuthProvider value={token}>
          <WrapperComponent {...this.props} token={token} />
        </AuthProvider>
      )
    }
  }
