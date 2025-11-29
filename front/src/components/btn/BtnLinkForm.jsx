import React from 'react';
import { Link } from 'react-router';

function BtnLinkForm({linkPath,className,btnName}) {
    return (
        <Link to={linkPath} className={className}>{btnName}</Link>
    );
}

export default BtnLinkForm;