"use client";

import { ArchiveIcon, MoreVerticalIcon, SearchIcon, SendIcon, SlidersHorizontalIcon } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Message, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { conversations, formatMoney, getProductById } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";

export default function AdminInboxPage() {
  const active = conversations[0];
  const product = active.productId ? getProductById(active.productId) : undefined;

  return (
    <div className="-m-4 grid min-h-[calc(100svh-4rem)] overflow-hidden md:-m-8 lg:grid-cols-[380px_1fr]">
      <aside className="border-r bg-[#06131f]">
        <div className="flex h-20 items-center justify-between border-b px-6">
          <h1 className="font-heading text-2xl font-bold uppercase">Active transmissions</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Filter conversations">
              <SlidersHorizontalIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Search conversations">
              <SearchIcon />
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={cn(
                "flex gap-4 border-l-4 border-transparent p-5 text-left hover:bg-muted/50",
                conversation.id === active.id && "border-primary bg-primary/10",
              )}
              type="button"
            >
              <Avatar className="size-12 rounded-none border border-border">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.customerInitials}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-4">
                  <span className="truncate font-heading font-semibold uppercase">{conversation.customerName}</span>
                  <span className="shrink-0 text-sm font-medium text-primary">{conversation.lastMessageAt}</span>
                </span>
                <span className="mt-1 block truncate font-mono text-xs text-muted-foreground">{conversation.lastMessage}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>
      <section className="hidden min-h-0 flex-col lg:flex">
        <header className="flex h-20 items-center gap-4 border-b px-6">
          <Avatar className="size-12 rounded-none border border-primary">
            <AvatarImage src={active.avatar} />
            <AvatarFallback>{active.customerInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-heading text-xl font-bold uppercase text-primary">{active.customerName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{active.status}</Badge>
              <span>Customer since 2023</span>
            </div>
          </div>
          <Button variant="outline">
            <ArchiveIcon data-icon="inline-start" />
            Archive
          </Button>
          <Button>Resolve</Button>
          <Button variant="ghost" size="icon-sm" aria-label="Conversation options">
            <MoreVerticalIcon />
          </Button>
        </header>
        <MessageScrollerProvider>
          <MessageScroller className="hud-grid flex-1 bg-muted/20">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-7 px-8 py-10">
                <MessageScrollerItem className="flex justify-center">
                  <div className="border border-border bg-background px-4 py-1 font-mono text-[10px] uppercase text-muted-foreground">Transmission log // Today</div>
                </MessageScrollerItem>
                {product ? (
                  <MessageScrollerItem>
                    <div className="gui-panel mx-auto flex w-full max-w-xl gap-4 border bg-card p-3">
                      <span className="relative size-20 shrink-0 overflow-hidden border">
                        <Image
                          src={product.images[0].src}
                          alt={product.images[0].alt}
                          fill
                          sizes="80px"
                          className="image-tech object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Viewing Product</p>
                        <p className="truncate font-semibold">{product.title}</p>
                        <p className="font-bold text-primary">{formatMoney(product.price)}</p>
                      </div>
                    </div>
                  </MessageScrollerItem>
                ) : null}
                <MessageGroup>
                  {active.messages.map((message) => {
                    const fromBusiness = message.sender === "business";

                    return (
                      <MessageScrollerItem key={message.id} scrollAnchor={message.id === active.messages.at(-1)?.id}>
                        <Message align={fromBusiness ? "end" : "start"}>
                          <MessageContent>
                            <Bubble align={fromBusiness ? "end" : "start"} variant={fromBusiness ? "default" : "tinted"}>
                              <BubbleContent>{message.body}</BubbleContent>
                            </Bubble>
                            <MessageFooter>{message.timestamp}</MessageFooter>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    );
                  })}
                </MessageGroup>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <footer className="border-t bg-[#06131f] p-6">
          <InputGroup className="h-auto rounded-none bg-background font-mono text-xs">
            <InputGroupTextarea placeholder={`TRANSMIT TO ${active.customerName.toUpperCase()}...`} rows={3} />
            <InputGroupAddon align="block-end" className="justify-between border-t">
              <span className="text-xs text-muted-foreground">Press Ctrl + Enter to send</span>
              <InputGroupButton>
                Send
                <SendIcon data-icon="inline-end" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </footer>
      </section>
    </div>
  );
}
