const APIURL = 'http://localhost:3001/api/v1'

async function login(email, password) {
   const url = APIURL + '/session'

   try {
      const response = await fetch(url, {
         method: 'POST',
         credentials: 'include',
         body: JSON.stringify({
            email: email,
            password: password,
         }),
         headers: {
            'Content-Type': 'application/json',
         },
      })
      if (response.ok) {
         const user = await response.json()
         return user
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

async function logout() {
   const url = APIURL + '/sessions/current'

   try {
      const response = await fetch(url, {
         method: 'DELETE',
         credentials: 'include',
      })
      if (response.ok) {
         return true
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

async function refresh() {
   const url = APIURL + '/sessions/current'

   try {
      const response = await fetch(url, {
         credentials: 'include',
      })
      if (response.ok) {
         const user = await response.json()
         return user
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

const LoginAPI = { login, logout, refresh }
export default LoginAPI
