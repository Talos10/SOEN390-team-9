import style from './Welcome.module.css'
import WelcomeButtons from './WelcomeButtons'

export default function Welcome() {
  return (
    <div>
      <h1 className={style.centerMessage}>Welcome to Supreme ERP</h1>
      <div className={style.centerComponent}>
        <WelcomeButtons></WelcomeButtons>
      </div>
    </div>
  )
}


