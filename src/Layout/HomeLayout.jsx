// layouts/HomeLayout.jsx
function HomeLayout({ children }) {
  return (
    <div className=" min-h-screen w-full bg-transparent overflow-x-hidden" >
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className=" absolute top-[-30%] left-[-20%] w-[520px] h-[520px] bg-blue-500/5 rounded-full blur-[160px]" />
        <div className=" absolute bottom-[-30%] right-[-20%] w-[520px] h-[520px] bg-rose-500/5 rounded-full blur-[160px] " />
      </div>

      <main className=" w-full max-w-[1120px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {children}
      </main>
    </div>
  );
}

export default HomeLayout;
