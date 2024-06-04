import { createClient, encryption, newSignatureProvider, IClient } from "postchain-client";

const privKey = Buffer.from("2BB56EA28F38FA9373693C00B7BC3C33AC74E89CAE7F662C8B125CEA765DA94E", "hex");
const bookKeeperKeyPair = encryption.makeKeyPair(privKey);
const bookKeeperSignatureProvider = newSignatureProvider(bookKeeperKeyPair);

const blockchainRID = "CE292B232DB9DB6FF397C6A83905C5D198E42EC9D5028AB8317F17CBD571A810";

let client: IClient | null = null;

async function initClient() {
    if (!client) {
        client = await createClient({
            nodeUrlPool: ["http://localhost:7740"],
            blockchainRid: blockchainRID,
        });
    }
}

export async function createBook(isbn: string, title: string, author: string) {
    await initClient();
    if (client) {
        await client.signAndSendUniqueTransaction(
            { name: "create_book", args: [isbn, title, author] },
            bookKeeperSignatureProvider
        );
    }
}

export async function getAllBooks() {
    await initClient();
    if (client) {
        return await client.query("get_all_books", {});
    }
    return [];
}

export async function getReviewsForBook(isbn: string) {
    await initClient();
    if (client) {
        return await client.query("get_all_reviews_for_book", { isbn });
    }
    return [];
}

export async function createBookReview(isbn: string, reviewerName: string, review: string, rating: number) {
    await initClient();
    if (client) {
        await client.signAndSendUniqueTransaction(
            { name: "create_book_review", args: [isbn, reviewerName, review, rating] },
            bookKeeperSignatureProvider
        );
    }
}
