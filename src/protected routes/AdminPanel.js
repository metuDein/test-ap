import React, { useContext } from 'react'
import AdminPanelCard from './AdminPanelCard'
import { faGears, faUsersGear, faFolderOpen, faUser, faFolderPlus, faMessage} from '@fortawesome/free-solid-svg-icons'
import DataContext from '../context/DataContext'

const AdminPanel = () => {
    const {allAssets, allUsers, allMessages} = useContext(DataContext)
    return (
        <section>
                <div className='admin-info-tab'>
                    <span>
                        <h1>Total users : {allUsers?.length}</h1>
                    </span>
                    <span>
                        <h1>Total Assets : {allAssets?.length}</h1>
                    </span>
                    <span>
                        <h1>Total Messages : {allMessages?.length}</h1>
                    </span>
                </div>
            <div className='admin-panel'>
                <AdminPanelCard title={'user settings'} icon={faUsersGear} pagelink={'/admin-panel-users'}/>
                <AdminPanelCard title={'Admin settings'} icon={faGears} pagelink={''}/>
                {/* <AdminPanelCard title={'Collections'} icon={faFolderOpen} pagelink={''}/> */}
                <AdminPanelCard title={'Create User'} icon={faUser} pagelink={'/admin-panel-create-user'} />
                <AdminPanelCard title={'View Assets'} icon={faFolderOpen} pagelink={'/admin-panel-assets'} />
                <AdminPanelCard title={'Create Assets'} icon={faFolderPlus} pagelink={'/admin-panel-create-asset'} />
                <AdminPanelCard title={'Messages'} icon={faMessage} pagelink={'/admin-panel-messages'} />
            </div>
        </section>
    )
}

export default AdminPanel