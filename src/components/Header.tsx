import Link from 'next/link';



export default function Header(){
    

    return (
    <nav className="navbar navbar-expand-lg navbar-light  head">
        <Link href="/" className="navbar-brand head-text-brand" >BookInsight</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <Link href="/" className="nav-link head-text-navs" >Home <span className="sr-only">(current)</span></Link>
                    
                </li>
                {/* <li>
                    <Link href="/linking" className='nav-link'>Link</Link>
                </li> */}
            </ul>
        </div>
    </nav>
    );
}