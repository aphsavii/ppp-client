function Footer() {
  return (
    <footer className="border-t dark:bg-[#000]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} T&P SLIET. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
