import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import messageService from '../services/message.service';

const ProfilePage = () => {
  const { id } = useParams(); // conversation ID
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await messageService.getCustomerInfo(id);
      if (res.customer) setCustomer(res.customer);
    };
    fetchCustomer();
  }, [id]);

  return (
    <div>
      <h2>Customer Profile</h2>
      {customer ? (
        <>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <img src={customer.picture} alt="Customer" style={{ width: 100 }} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
