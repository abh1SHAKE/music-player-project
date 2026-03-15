const NavbarText = ({displayText,active}) => {
    return (
        <div className="flex items-center justify-start cursor-pointer whitespace-nowrap shrink-0">
            <div className={`${active ? "text-white" : "text-gray-500"}
            font-semibold hover:text-white`}>
                {displayText}
            </div>
        </div>
    );
};

export default NavbarText;