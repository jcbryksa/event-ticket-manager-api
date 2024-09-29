export type SlotAvailability = {
  index: number
  code: string
  available: boolean
}

export type PresentationSectionItemAvailability = {
  presentationSectionItemId: string
  locationSectionName: string
  capability: number
  available: number
  slots?: SlotAvailability[]
}

export type PresentationSectionAvailability = {
  id: string
  name: string
  price: number
  presentationSectionItems?: PresentationSectionItemAvailability[]
}

export type EventTicketAvailability = {
  id: string
  status: string
  presentationId: string
  presentationSections?: PresentationSectionAvailability[]
}
