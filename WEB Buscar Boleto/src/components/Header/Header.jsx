import './Header.css';

export const Header = ({title}) => {
    return (
        <header className="header">
            <div className='xlogo'>
                <h1 className='textw'>WAPI</h1>
            </div>
            <h1 className="title">{title}</h1>            
        </header>
    )
}