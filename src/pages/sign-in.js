import React from 'react'
import Layout from '../templates/Layout'
import { authenticate } from '../services/moocfi'
import { navigate, Link } from 'gatsby'
import { TextField, Button } from '@material-ui/core'

import styled from 'styled-components'
import LoginStateContext, {
  withLoginStateContext,
} from '../contexes/LoginStateContext'
import Container from '../components/Container'

const Row = styled.div`
  margin-bottom: 1.5rem;
`

const Form = styled.form``

const InfoBox = styled.div`
  margin-bottom: 2rem;
`

const FormContainer = styled.div`
  height: 100%;
  margin-top: 2rem;
`

class SignInPage extends React.Component {
  static contextType = LoginStateContext

  onClick = async e => {
    e.preventDefault()
    if (
      this.state.submitting ||
      (this.state.email.length === 0 && this.state.password.length === 0)
    ) {
      return
    }
    this.setState({
      submitting: true,
      error: false,
    })
    try {
      await authenticate({
        username: this.state.email,
        password: this.state.password,
      })
      if (typeof window !== 'undefined') {
        console.log("Navigating back")
        window.history.back()
        return
      }
      navigate('/')
    } catch (error) {
      this.setState({ error: true, submitting: false })
      return
    }
  }

  state = {
    email: undefined,
    password: undefined,
    submitting: false,
    error: false,
  }

  render() {
    if (this.context.loggedIn) {
      navigate('/')
      return <div>Redirecting....</div>
    }
    return (
      <Layout>
        <Container>
          <FormContainer>
            <h1>Kirjaudu sisään</h1>
            <Form>
              <InfoBox>
                Tämä kurssi käyttää{' '}
                <a
                  href="https://mooc.fi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mooc.fi
                </a>{' '}
                käyttäjätunnuksia. Jos olet aikaisemmin tehnyt mooc.fi -kursseja
                voit käyttää olemassaolevia tunnuksiasi.
              </InfoBox>

              <Row>
                <TextField
                  id="outlined-adornment-password"
                  variant="outlined"
                  type="text"
                  label="Sähköpostiosoite tai käyttäjänimi"
                  fullWidth
                  value={this.state.email}
                  onChange={o => this.setState({ email: o.target.value })}
                />
              </Row>
              <Row>
                <TextField
                  id="outlined-adornment-password"
                  variant="outlined"
                  type={this.state.showPassword ? 'text' : 'password'}
                  label="Salasana"
                  fullWidth
                  value={this.state.password}
                  onChange={o => this.setState({ password: o.target.value })}
                />
              </Row>

              <Row>
                <Button
                  onClick={this.onClick}
                  disabled={this.state.submitting}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Kirjaudu sisään
                </Button>
              </Row>
            </Form>
            {this.state.error && (
              <InfoBox>
                <b>Invalid credentials</b>
              </InfoBox>
            )}
            <Row>
              <Link to="/sign-up">Luo uusi tunnus</Link>
            </Row>
            <Row>
              <a
                href="https://tmc.mooc.fi/password_reset_keys/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unohdin salasanani
              </a>
            </Row>
          </FormContainer>
        </Container>
      </Layout>
    )
  }
}

export default withLoginStateContext(SignInPage)
