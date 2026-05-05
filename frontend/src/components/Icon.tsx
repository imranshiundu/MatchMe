type IconProps = {
    name: string;
    className?: string;
    size?: number;
};

function Icon({ name, className = '', size = 18 }: IconProps) {
    return(
        <svg 
            className={className} 
            width={size} 
            height={size} 
            fill="currentColor" 
            stroke="currentColor" 
            strokeWidth="0"
        >
            <use href={`/icons.svg#${name}`}/>
        </svg>
    )
}

export default Icon;
