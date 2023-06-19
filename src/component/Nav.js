import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faShoppingCart, faUser, faMagnifyingGlass, faWallet,  faBell, faArrowRightFromBracket, faGear, faFolder, faPenNib, faCloudMoon,  faClock, faAddressCard } from '@fortawesome/free-solid-svg-icons';


import { Link } from 'react-router-dom';


import { useContext } from 'react';
import DataContext from '../context/DataContext';
import useAuth from '../hook/useAuth';
import { FaEthereum } from 'react-icons/fa';

const Nav = () => {
  const { handleThemeChange, menuTab, handleMenuTab, darkmode } = useContext(DataContext);
  const {auth, setAuth} = useAuth()




  const handleDisconnect = async () => {
    console.log('started log out')
   
      try {
        if (window.ethereum) {
          window.ethereum.selectedAddress = null;
        }
        // Perform any additional cleanup or logout logic here
    
      // Perform any additional cleanup or logout logic here
      setAuth({});
      console.log(auth)
      
      handleMenuTab()
    } catch (error) {
      console.error('Error disconnecting MetaMask:', error);
    }
  };


  return (
    <header className='broker-navbar'>
      <div className='web-logo nav'>
      <Link to={'/'} style={{color : `${darkmode ? '#000' : '#fff'}`, display: 'flex',  textDecoration : 'none' ,alignItems:'center', justifyContent :'space-between' }}>
        <img src={`images/finallogo.png`} />
        <h1>TritonsPrime</h1>
        </Link>
      </div>
      <form className='nav--form'>
        
        <input
          type="text"
          placeholder='Search for Assets or Contract Address'
        />
        <span className='magnifying--glass'>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#000' }} />
        </span>
      </form>
      {auth?.user && <span className='balance'> <span> Balance : </span><FaEthereum />  {` ${ auth.user.balance } `}  </span>}
      <div className='connect-wallet' >
        <h3 className="connect--title"><span style={{ marginRight: '3px' }}><FontAwesomeIcon icon={faWallet} /></span> {!auth?.user && <Link to={'/walletlogin'} style={{color  : '#fff', textDecoration : 'none'}}> <span className='connect--title--text'> Connect your wallet </span></Link> }   { auth.user &&  <span className='connect--title--text'> Wallet Connected </span>} {auth.user && <span className='media--balance'><FaEthereum />  {` ${ auth.user.balance } `} </span>}</h3>
        <FontAwesomeIcon icon={faUser} style={{ marginLeft: '8px', borderRadius: '50%', border: '1px solid #777', padding: '3px', width: '15px', height: '15px', fontSize: '14px' }}  onClick={handleMenuTab}/>
        <ul className={`nav-dropdown ${menuTab ? 'active' : ''}`}>
          <li><Link onClick={handleMenuTab} to={'/user-profile'} style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faUser} style={{ marginRight: '8px',  fontSize: '14px' }} />Profile </Link></li>
          <li><Link onClick={handleMenuTab} style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', fontSize: '14px' }} /> My purchases </Link></li>
          <li><Link onClick={handleMenuTab} to={'/user-create'} style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faPenNib} style={{marginRight : '8px',  fontSize: '14px'}}/> Create </Link></li>
          <li><Link to={'/user-verification'} onClick={handleMenuTab} style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faAddressCard} style={{marginRight : '8px',  fontSize: '14px'}}/> Verification </Link></li>
          <li><Link onClick={handleMenuTab} to={'/user-edit-profile'} style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faGear} style={{ marginRight: '8px', fontSize: '14px' }} /> Settings </Link></li>
          <li><Link to={'/user-notifications'} onClick={handleMenuTab}  style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faBell} style={{ marginRight: '8px', fontSize: '14px' }} /> Notifications  </Link></li>
          
          <li><Link onClick={handleDisconnect} style={{color : '#fff', textDecoration : 'none'}} ><FontAwesomeIcon icon={faArrowRightFromBracket} style={{ marginRight: '8px', fontSize: '14px' }} />  Log Out </Link></li>
        </ul>
      </div>
        <Link to={'/cart'}>
      <div >
        <FontAwesomeIcon icon={faShoppingCart} style={{ border: '1px solid #777', borderRadius: '10px', padding: '8px 10px' }} />
      </div>
        </Link>
      <div>
      </div>
    </header>
  )
}

export default Nav