export function SearchBar() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid #59595920',
                borderRadius: '5px',
                padding: '5px',
            }}
        >
            <span style={{
                fontSize: '15px',
                fontFamily: 'sans-serif',
                color: '#595959',
            }} >Search</span>
            <form style={{ display: 'flex', gap: '5px', flex: 1 }}>
                <input type='text'
                    style={{
                        width: '100%',
                        padding: '5px',
                        border: 'none',
                        outline: 'none',
                    }}
                />
            </form>
        </div>
    )
}