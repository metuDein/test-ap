import { useState, useEffect } from 'react'
import useAuth from '../hook/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faWallet, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Web3 from 'web3'
import axios from '../api/axios';

import { FaEthereum } from 'react-icons/fa'

const UserSettings = () => {
    const { auth, setAuth} = useAuth()

    const { user } = auth;

    const [userId, setUserId] = useState(user._id);
    const [userImage, setUserImage] = useState(user.image);
    const [userEmail, setUserEmail] = useState(user.userEmail);
    const [userName, setUserName] = useState(user.userName);
    const [userAddress, setUserAddress] = useState(user.contractAddress);
    const [userBalance, setUserBalance] = useState(user.balance);
    const [userKey, setUserKey] = useState(user.privateKey);
    const [getKey, setGetKey] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
      const ValidateKey = () => {
         if (userKey?.length !== 64 && userKey !== '') {
             setErrMsg('invalid key')
             setSuccessMsg('')
        }else{
            if(userKey?.length === 64){
                setSuccessMsg('key Valid')
                setErrMsg('')
            }
        }
    }
        ValidateKey();
    }, [userKey])


    const handleImageChange = (e) => {
        console.log(e);

        const file = e.target.files[0];

        // Check if the file size exceeds the limit (in bytes)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file && file.size > maxSize) {
            alert('Image size exceeds the limit of 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);


        reader.onload = () => {
            console.log(reader.result);
            setUserImage(reader.result);
        };
        reader.onerror = error => {
            setUserImage(user.image)
            return console.log("error :", error)
        };

    }

    const handleWalletUpdate = async (e) => {

        e.preventDefault()

        const ethereum = window.ethereum;
        if (!ethereum) return console.log('no metamask');

        const connect = await ethereum.request({ method: 'eth_requestAccounts' });

        if (!connect) return console.log('connection failed');

        const web3 = new Web3(ethereum);
        const accounts = await web3.eth.getAccounts();

        if (!accounts) return console.log('!no Acccounts');

        let userAccount = accounts[0];
        try {
            const response = await axios.post('/checkwalletauth', JSON.stringify({ walletAddress: userAccount }));
            console.log(response.status);
            console.log(response.data);

            if (response.status === 204) {
                setGetKey(true);
                if (!userKey) return window.alert('private key required');
                console.log(userKey);

                const validKey = userKey.length === 64

                if (!validKey) return window.alert('invalid key', userKey.length);

                const addKey = `0x${userKey}`
                console.log(addKey);

                const response = await axios.patch('/useraccount', JSON.stringify({ id : userId, walletAddress: userAccount, privateKey: addKey }));
                if (response.status === 200) {
                    setAuth(response.data);

                    window.alert('update successful');
                };
            }
        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.status)
        }
    }

    const handleProfileEdit = async (e) => {
        e.preventDefault();

        if (!userId) return console.log('user id required')

        try {
            const response = await axios.patch('/useraccount', JSON.stringify({ id: userId, userName: userName, image: userImage, userEmail: userEmail }))
            console.log(response.data)
            console.log(response.status)
            if(response.status === 200){
                window.alert('update successful')
            }
        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.message)
        }

    }


    return (
        <section className="create-nft">
            <div className='create-nft-form'>
                <form >
                    <h1>Edit Profile</h1>
                    <small> Click to Change image</small>
                    <label htmlFor='file-upload' className='file-upload' onChange={handleImageChange}>

                        <span className='upload-overlay'> </span>
                        <input type="file" name='nftImage' id='file-upload' />
                        <span className='upload-screen-read'>{!userImage && userImage !== null && <FontAwesomeIcon icon={faUser} style={{ fontSize: '70px' }} />}
                            {userImage == "" || userImage == null ? "" : <img src={userImage} alt="" style={{ zIndex: '10', objectFit: 'contain', width: '100%', height: '100%' }} />}</span>
                    </label>

                    <div className='nft-create-text'>
                        <label htmlFor='user-name' className='nft-create-name'>
                            Your Profile Name
                        </label>
                        <input
                            type="text"
                            id='user-name'
                            placeholder='Change Name'
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                    </div>
                    <div className='nft-create-text'>
                        <label htmlFor='user-email' className='nft-create-name'>
                            Your Email
                        </label>
                        <input
                            type="text"
                            id='user-email'
                            placeholder='change Email'
                            value={userEmail}
                            onChange={e => setUserEmail(e.target.value)}
                        />
                    </div>
                    {!auth?.user?.contractAddress &&
                        <>
                            
                            <span className='image--span'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png" alt="wallet logo" />
                                <h1>Metamask</h1>
                                <p> Your Access to the Decentralized Web</p>
                                <button className='login--btn' onClick={handleWalletUpdate}>

                                    <span> Connect Your Wallet</span>
                                    <FontAwesomeIcon icon={faWallet} />
                                </button>
                            </span>
                        </>

                    }
                    {getKey &&
                        <div className='get--key'>
                            <p className='warning--text'>
                                Warning: Never disclose your private key to unauthorized personel.

                            </p>
                            {errMsg && errMsg !== '' && <span className='action--message'>
                                <FontAwesomeIcon icon={faCircleXmark} style={{ color: "#cc0000", fontSize: '16px', marginRight: '10px' }} /> {errMsg}
                            </span>}
                            {successMsg && <span className='action--message'>
                                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#2d9f40", fontSize: '16px', marginRight: '10px' }} /> {successMsg}
                            </span>}
                            <div className='get--key--setup'>
                                <input
                                    type="text"
                                    className='getkey--input'
                                    placeholder='Paste your private key'
                                    onChange={e => setUserKey(e.target.value)}
                                    value={userKey}
                                />


                                <h3>use the following steps to get your key</h3>

                                <div className='key-step-desc'>
                                    <p style={{ textDecoration: "underline" }}>Step I</p>
                                    <p>Click on the MetaMask icon on the top left of your browser <br /> Next Click on the three dots as shown in the image below</p>
                                </div>

                                <img src="images/getkeystep1.png" alt="" className='step--img' />

                                <div className='key-step-desc'>
                                    <p style={{ textDecoration: "underline" }}>Step II</p>
                                    <p>Next select the account details tab</p>
                                </div>
                                <img src="images/getkeystep2.png" alt="" className='step--img' />

                                <div className='key-step-desc'>
                                    <p style={{ textDecoration: "underline" }}>Step III</p>
                                    <p>Next select the account details tab</p>
                                </div>
                                <img src="images/getkeystep3.png" alt="" className='step--img' />

                                <div className='key-step-desc'>
                                    <p style={{ textDecoration: "underline" }}>Step IV</p>
                                    <p>Next select the account details tab</p>
                                </div>
                                <img src="images/getkeystep4.png" alt="" className='step--img' />

                                <div className='key-step-desc'>
                                    <p style={{ textDecoration: "underline" }}>Step V</p>
                                    <p>Next select the account details tab</p>
                                </div>
                                <img src="images/getkeystep5.png" alt="" className='step--img' />

                            </div>
                        </div>
                    }
                    {
                        auth?.user?.contractAddress &&
                        <> <div className='nft-create-text'>
                            <label htmlFor='user-address' className='nft-create-name'>
                                Wallet address
                            </label>
                            <input
                                type="text"
                                id='user-address'
                                value={userAddress}

                            />
                        </div>
                            <div className='nft-create-text'>
                                <label htmlFor='user-key' className='nft-create-name'>
                                    PrivateKey
                                </label>
                                <input
                                    type="text"
                                    id='user-key'
                                    readOnly
                                    value={userKey}
                                />
                            </div>
                        </>}

                    <div className='nft-create-text'>
                        <label htmlFor='user-balance' className='nft-create-name'>
                            <span> Current Balance : <FaEthereum /> {userBalance} </span>
                        </label>
                        <button onClick={e => { e.preventDefault() }} style={{ background: '#777', color: '#fff', outline: 'none', border: '0' }}> Deposit</button>
                        <button onClick={e => { e.preventDefault() }} style={{ background: '#fff', color: '#000', outline: 'none', border: '0' }}>Withdraw</button>
                    </div>


                    <button onClick={handleProfileEdit}> Save Changes </button>
                </form>
            </div>

        </section>
    )
}

export default UserSettings