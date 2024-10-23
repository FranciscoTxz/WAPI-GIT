import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { Section } from './components/Section/Section'
import './App.css'

function App() {

  return (
    <>
      <Header title='Consultar Boleto'/>
      <div className='divx'>
        <Section />
      </div>
      <Footer/>
    </>
  )
}

export default App
