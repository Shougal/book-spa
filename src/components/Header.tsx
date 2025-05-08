import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NavbarBrand  from 'react-bootstrap/NavbarBrand';
import  NavLink  from 'react-bootstrap/NavLink';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
import Link from 'next/link';
import NavbarToggle from 'react-bootstrap/NavbarToggle';

export default function Header(){
    

    return (
        <Navbar expand ="lg" className='bg-light'>
            <Container>
                <NavbarBrand>
                BookInsight 
                </NavbarBrand>
                <NavbarToggle/>
                <NavbarCollapse >
                    <Nav className="me-auto">
                        <NavLink as ={Link}  href='/'>Home</NavLink>

                    </Nav>
                </NavbarCollapse>


            </Container>
        </Navbar>
    );
}