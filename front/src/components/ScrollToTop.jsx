import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

function ScrollToTop(props) {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.activeElement?.blur();
    }, [pathname]);

    return null;
}

export default ScrollToTop;