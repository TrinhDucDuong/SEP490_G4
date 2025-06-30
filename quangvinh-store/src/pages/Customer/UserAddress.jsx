import SidebarProfile from "./Common/SidebarProfile.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";

function UserAddress () {
    const breadcrumbItems = [
        { label: 'Trang chủ', to: '/' },
        { label: 'Tài Khoản', to: '/profile' },
        { label:'Địa chỉ', to: '/profile/address'}
    ];
    return (
        <>
            <div>
                <Breadcrumb items={breadcrumbItems}/>
                <div>
                    <SidebarProfile />
                    <div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default UserAddress;