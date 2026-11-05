// Formulário da página Login; os valores e ações vêm da rota que o utiliza.
export default function CardForms({ mode, setMode, identifier, setIdentifier, password, setPassword, name, setName, error, message, canSubmit, handleSubmit, setError, setMessage }) {
  return <>
    <h2>{mode === 'login' ? 'Entrar' : 'Criar nova conta'}</h2>
    <form className="login-form" onSubmit={handleSubmit}>
      {mode === 'signup' && <div className="field">
        <input id="name" type="text" value={name} placeholder=" " autoComplete="name" onChange={event => setName(event.target.value)}/>
        <label htmlFor="name">Nome completo</label>
      </div>}
      <div className="field">
        <input id="identifier" type="text" value={identifier} placeholder=" " autoComplete="username" onChange={event => setIdentifier(event.target.value)}/>
        <label htmlFor="identifier">Número de celular, nome de usuário ou email</label>
      </div>
      <div className="field">
        <input id="password" type="password" value={password} placeholder=" " autoComplete={mode === 'login' ? 'current-password' : 'new-password'} onChange={event => setPassword(event.target.value)}/>
        <label htmlFor="password">Senha</label>
      </div>
      {error && <p className="login-error">{error}</p>}
      {message && <p className="login-error" style={{ color: '#7dcea0' }}>{message}</p>}
      <button className="btn btn-primary" type="submit" disabled={!canSubmit}>{mode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
      {mode === 'login' && <button className="forgot" type="button" onClick={() => setMessage('Recuperação de senha entra depois, com o backend.')}>Esqueceu a senha?</button>}
      <div className="divider"/>
      <button className="btn btn-ghost" type="button"><span className="facebook-mark">f</span>Entrar com Facebook</button>
      <button className="btn btn-outline" type="button" onClick={() => {
        setError('')
        setMessage('')
        setMode(mode === 'login' ? 'signup' : 'login')
      }}>{mode === 'login' ? 'Criar nova conta' : 'Já tenho uma conta'}</button>
    </form>
  </>
}
