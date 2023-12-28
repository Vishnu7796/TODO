import React, {useEffect, useState} from 'react';
import { useKeycloak } from "@react-keycloak/web";
import axios from 'axios';

const Home = () => {
  const { keycloak, initialized } = useKeycloak();
  // console.log(props.keycloak);
  const [data, setData] = useState(null);
  useEffect(() => {
    // This code runs after the component has mounted
    const fetchData = async () => {
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint you want to fetch data from
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/login`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`, // Replace 'your-token' with the actual token
          },
        });

        // Assuming the response data is an object
        console.log(response.data.data)
        // console.log(keycloak.authenticated);
        // console.log(keycloak.token);

        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log(keycloak.authenticated);
    console.log(keycloak.token);
    if(keycloak.authenticated)
      fetchData();
    return () => {
      // Cleanup code when the component is unmounted
    };
  }, [keycloak]); // Empty dependency array means the effect runs once after the initial render

 return (
   <div>
     <h1 className="text-green-800 text-4xl">Welcome to the Homepage</h1>
     <div>
      {data ? (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        'Loading...'
      )}
    </div>
   </div>
 );
};

export default Home;