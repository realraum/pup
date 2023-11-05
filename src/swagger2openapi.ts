import converter from 'swagger2openapi'

function getNestedAndDel (obj: any, xKey: string, xSubkey: string) {
  if (obj['x-' + xKey]) {
    const val: any = obj['x-' + xKey][xSubkey]
    delete obj['x-' + xKey][xSubkey]
    return val
  }
}

function getNested (obj: any, xKey: string, xSubkey: string) {
  if (obj['x-' + xKey]) {
    return obj['x-' + xKey][xSubkey]
  }
}

function cleanEmpty (obj: any, xKey: string) {
  if (obj['x-' + xKey] && !Object.keys(obj['x-' + xKey]).length) {
    delete obj['x-' + xKey]
  }
}

function processProperty (property: any) {
  if (getNestedAndDel(property, 'format', 'guid')) {
    property.type = 'uuid'
  }
  if (getNestedAndDel(property, 'meta', 'readOnly')) {
    property.readOnly = true
  }
  if (getNestedAndDel(property, 'meta', 'nullable')) {
    property.nullable = true
  }
  if (getNested(property, 'meta', 'name')) {
    property.name = getNestedAndDel(property, 'meta', 'name')
  }

  cleanEmpty(property, 'format')
  cleanEmpty(property, 'meta')
}

export default async function swagger2openapi (obj: any): Promise<any> {
  const converted = await converter.convertObj(obj, {})

  for (const schema of Object.values(converted.openapi.components.schemas)) {
    processProperty(schema)
    for (const property of Object.values(schema.properties || {})) {
      processProperty(property)
    }
  }

  return converted.openapi
}

