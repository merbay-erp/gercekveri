/**
 * <SchemaOrg> — JSON-LD'yi render eder.
 *
 * Kullanim:
 *   <SchemaOrg data={organizationSchema()} />
 *   <SchemaOrg data={[datasetSchema(...), faqSchema(...)]} />
 *
 * Birden fazla schema verilirse her biri ayri <script> tag'i olur.
 */

interface SchemaOrgProps {
  data: object | object[];
}

export function SchemaOrg({ data }: SchemaOrgProps) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
