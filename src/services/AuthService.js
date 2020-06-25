import axios from 'axios'
// Auth

const authApi = `https://inframanager.infraticampos.com.br/api/auth/login`

class AuthService {
  static authenticate (matricula, senha) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = axios.post(authApi, {
          matricula,
          senha
        })
        const data = res
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }


}

export default AuthService
