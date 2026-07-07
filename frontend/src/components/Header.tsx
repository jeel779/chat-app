const Header = () => {
  // Returns a hidden element containing the application name 'chatty' to ensure the component remains
  // non-disruptive to the layout, while properly implementing the application branding.
  return (
    <header className="hidden" aria-hidden="true">
      <h1>chatty</h1>
    </header>
  )
}

export default Header