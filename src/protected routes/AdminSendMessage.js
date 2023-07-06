import {useState, useEffect, useContext} from 'react';
import DataContext from '../context/DataContext';
import useAuth from '../hook/useAuth';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';




const AdminSendMessage = () => {
    const { allUsers } = useContext(DataContext)
    const {auth} = useAuth();
    const {user} = auth;

    
    

    


    const {isLoading, setIsLoading, sendTo} = useContext(DataContext)
    


    const [title, setTitle] = useState('')
    const [body, setBody] = useState('');
    const [User, setUser] = useState('');
    const [authLoading, setAuthLoading] = useState(false)


    const usersOpt = (
        allUsers.map(user => {
            return <option value={user?.userName} key={user._id}> {user.userName} </option>
        }) 
    )
    
    const handleBodyChange = (e) => {
        setBody(e.target.value)
    }

    const handleSubjectChange = (e) => {
        setTitle(e.target.value)
    }
    const HandleUserChange = (e) => {
        setUser(e.target.value)
    }

    const handleSend = async (e) => {

        e.preventDefault()

        if(!body || !title) return window.alert('all fields required')
        setAuthLoading(true);
        try {
            const response = await axios.post('/supportrequest', JSON.stringify({ senderAddress : user.contractAddress, sendername : 'TritonsPrimeAdmin',  receiver :  User, title : title, body :body,}));
            console.log(response.data)
            console.log(response.status)
            if(response.status === 200) {
                setAuthLoading(false)
                alert('message sent')
                return
            };
        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.status)
            setAuthLoading(false);
        }
    }

  return (
    <section className="create-nft">
        <div>
       
        <Link to={'/admin-panel'} style={{color: '#000', background : '#fff', padding : '10px', textDecoration : 'none', borderRadius : '10px'}}> Back To panel</Link>
    </div>
            <div className='create-nft-form'>
                
                <form encType='multipart/form-data' onSubmit={handleSend}>
                    <h1>Send Messages to user</h1>
                    
                   
                    <div className='nft-create-text'>
                        <label htmlFor='file-name' className='nft-create-name'>
                            Name <span>*</span>
                        </label>
                       
                    </div>
                    <div className='nft-create-text'>
                        <label htmlFor='file-price' className='nft-create-name'>
                            Subject <span></span>
                        </label>
                        <input
                            type="text"
                            id='file-price'
                            placeholder='Title'
                            onChange={handleSubjectChange}
                            value={title}
                        />
                    </div>
                    <div className='nft-create-text' >
                    <label htmlFor='file-owner' className='nft-create-desc' style={{marginTop : '20px'}}>
                            Send To
                        </label>
                        <select id='file-owner' placeholder='select owner' value={User} onChange={HandleUserChange}>
                           {usersOpt}
                        </select>
                        </div>
                    <div className='nft-create-text'>
                        <label htmlFor='file-description' className='nft-create-desc'>
                            <p>Message </p>
                           
                        </label>
                        <textarea
                            rows={'10'}
                            cols={'30'}
                            id='file-description'
                            placeholder='Provide a detailed description of your item'
                            onChange={handleBodyChange}
                            value={body}
                            
                        />
                    </div>
                    
                    { authLoading && <button  onClick={e => e.preventDefault()}>
                <FontAwesomeIcon icon={faSpinner} spin style={{color: "#c7d2e5", fontSize : '18px'}} />
                    </button>
                    }
                    {!authLoading && <button> Send </button>}
                </form>
            </div>

        </section>
  )
}

export default AdminSendMessage