import React, {useState, useEffect} from 'react';

const Header = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const counter = setInterval(() => setCount(count + 1), 1000);// eslint-disable-line no-magic-numbers
        return () => clearInterval(counter);
    });
    return <header>
        <p>Geolocation Demo</p>
        <p>move around and watch the point follow your location</p>
    </header>;
};

export default Header;