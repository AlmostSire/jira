export const Mark = (props: { name: string, keyword: string }) => {
    const { keyword, name } = props
    if (!keyword) {
        return <>{name}</>
    }
    const arr = name.split(keyword)
    return <div>
        {
            arr.map((str: string, index: number) => (
                <span key={index}>
                    {str}
                    {
                        index === arr.length - 1 ? null : 
                        <span style={{ color: '#257afd' }}>
                            {keyword}
                        </span>
                    }
                </span>
            ))
        }
    </div>
}