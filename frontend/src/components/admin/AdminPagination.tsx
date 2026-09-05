interface AdminPaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )

  return (
    <nav className="admin-pagination" aria-label="Paginação">
      <span className="admin-pagination-info">
        {total} {total === 1 ? 'resultado' : 'resultados'}
      </span>
      <div className="admin-pagination-controls">
        <button
          type="button"
          className="admin-pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          ←
        </button>
        {visiblePages.map((p, index) => {
          const prev = visiblePages[index - 1]
          const showEllipsis = prev !== undefined && p - prev > 1

          return (
            <span key={p} className="admin-pagination-page-wrap">
              {showEllipsis && <span className="admin-pagination-ellipsis">…</span>}
              <button
                type="button"
                className={`admin-pagination-btn ${p === page ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </span>
          )
        })}
        <button
          type="button"
          className="admin-pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
        >
          →
        </button>
      </div>
    </nav>
  )
}
