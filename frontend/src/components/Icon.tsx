function Icon({name, className='', size=18}) {
    return(
        <svg className={className} width={size} height={size}>
            <use href={`/icons.svg#${name}`}/>
        </svg>
    )
}

export default Icon;