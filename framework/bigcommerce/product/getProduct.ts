import type { GetProductQuery, GetProductQueryVariables } from '../schema'
import setProductLocaleMeta from '../api/utils/set-product-locale-meta'
import { BigcommerceConfig, getConfig } from '../api'
import { normalizeProduct } from '../lib/normalize'
import type { Product } from '@commerce/types'
import { productInfoFragment } from '../api/fragments/product'

export default async function getProduct(opt: { config: BigcommerceConfig }) {
  const { config } = opt
  let newConfig = getConfig(config)

  const locale = newConfig.locale
  const query = /* GraphQL */ `
    query productWithSku(
      $hasLocale: Boolean = false
      $locale: String = "null"
    ) {
      site {
        HW0109: product(sku: "HW0109") {
          ...productInfo
        }
        HW0110: product(sku: "HW0110") {
          ...productInfo
        }
      }
    }
    ${productInfoFragment}
  `
  const { data } = await newConfig.fetch(query, {
    variables: {
      hasLocale: false,
    },
  })
  const productions: Product[] = Object.keys(data.site).map((key) => {
    return data.site[key]
  })
  /* const product = data.site?.route?.node

  if (product?.__typename === 'Product') {
    if (locale && config.applyLocale) {
      setProductLocaleMeta(product)
    }

    return { product: normalizeProduct(product as any) }
  } */

  return productions
}
