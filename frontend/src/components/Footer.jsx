

function Footer() {
  return (
    <footer className="bg-dark-moss-green flex flex-col justify-between items-center px-[3rem] py-[1.5rem] md:flex-row w-full mt-auto">
        <div className="flex items-center gap-8">
            <img src="/footerImage.png" alt="chat bubble" className="size-[72px]" />
            <h1 className='font-bold text-[2.5rem] text-maize'>EduTea</h1>
        </div>
        <h1 className='font-bold text-[2.5rem] text-white'>A new place to grow</h1>
    </footer>
  )
}

export default Footer