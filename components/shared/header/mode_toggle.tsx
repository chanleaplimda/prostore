'use Client'
import {useTheme} from 'next-themes';

const ModalToggle = () => {
    const {theme, setTheme} = useTheme();

    return (
        <>Toggle</>
    )
};

export default ModalToggle;