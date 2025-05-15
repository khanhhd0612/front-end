const LoadingCard = () => {
    return (
        <div className="fx-1">
            <div className="card" aria-hidden="true">
                <p className='placeholder-glow'>
                    <img src="/assets/images/loadingimg.jpg" className="card-img-top placeholder" alt="..." />
                </p>
                <div className="card-body">
                    <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-8"></span>
                    </p>
                    <a className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                </div>
            </div>
        </div>
    )
}
export default LoadingCard